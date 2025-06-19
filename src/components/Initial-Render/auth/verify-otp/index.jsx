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
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(${59 + Math.random() * 40}, ${130 + Math.random() * 50}, ${246}, ${Math.random() * 0.5 + 0.1})`,
      });
    }

    function drawParticle(x, y, size, color) {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connection lines for nearby particles
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
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
          navigate('/student/ai-tutor');
        }
      }
      
      console.log('handleSubmit verify otp', res);
    } catch (error) {
      console.log('Error while verify', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden relative">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
              <KeyRound className="h-8 w-8 text-cyan-300" />
            </div>
            <h2 className="text-2xl font-bold text-white ml-3">Verify Your Account</h2>
          </div>
          <p className="text-center text-white/80 mb-6">
            We've sent a 6-digit code to your email. Please enter it below to verify your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
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
                  className="w-12 h-12 text-center text-lg backdrop-blur-sm bg-white/10 border-white/30 text-white focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white/20 transition-all duration-300"
                />
              ))}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Verify OTP
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors">
              Didn't receive the code? Resend
            </a>
          </div>
          <p className="mt-4 text-center text-sm text-white/70">
            Back to{" "}
            <a href="/login" className="text-cyan-300 hover:text-cyan-200 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
