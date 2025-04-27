import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import signuporloginStore from '../../../../zustand/login-signup/store';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const {verifyOtp, data} = signuporloginStore();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // Create particles with colors matching the theme
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(0, 112, 243, ${Math.random() * 0.5 + 0.1})`, // Using secondary color
      });
    }

    function drawParticle(x, y, size, color) {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connection lines for nearby particles
      ctx.strokeStyle = 'rgba(0, 112, 243, 0.05)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        drawParticle(particle.x, particle.y, particle.size, particle.color);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(0);
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value !== '' && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const otpString = otp.join('');
      console.log('OTP submitted:', otpString);
      let email = localStorage.getItem('email');
      
      // Call the verifyOtp function
      const res = await verifyOtp({email, otpString});
      
      // If verification successful
      if (res?.data?.status) {
        // The store will automatically save the user data from the response
        
        // Set logged in flag
        localStorage.setItem("loggedIn", true);
        
        // Get the user role from store or response to determine where to navigate
        const userData = res.data.user || {};
        console.log('userData', userData);
        // Navigate based on user role
        if (userData.role === 'ROLE_TEACHER') {
          navigate('/teacher/profile');
        } else {
          // Default to student dashboard
          navigate('/student/dashboard');
        }
      }
      
      console.log('handleSubmit verify otp', res);
    } catch (error) {
      console.log('Error while verify', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary via-background to-primary/90 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-secondary/10 p-3 rounded-full">
              <KeyRound className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-text ml-3">Verify Your Account</h2>
          </div>
          <p className="text-center text-text-muted mb-6">
            We've sent a 6-digit code to your email. Please enter it below to verify your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={inputRefs[index]}
                  className="w-12 h-12 text-center text-lg bg-muted border-border text-text"
                />
              ))}
            </div>
            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white">
              Verify OTP
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-secondary hover:text-secondary/80">
              Didn't receive the code? Resend
            </a>
          </div>
          <p className="mt-4 text-center text-sm text-text-muted">
            Back to{" "}
            <a href="/login" className="text-secondary hover:text-secondary/80">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
