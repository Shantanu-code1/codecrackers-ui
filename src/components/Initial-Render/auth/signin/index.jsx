import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import signuporloginStore from '../../../../zustand/login-signup/store';

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { signInUser } = signuporloginStore();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * 360,
        color: `rgba(${59 + Math.random() * 40}, ${130 + Math.random() * 50}, ${246}, ${Math.random() * 0.4 + 0.1})`
      });
    }

    function drawParticle(x, y, size, angle, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI / 180);
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.y += particle.speed;
        particle.angle += 0.5;
        if (particle.y > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
        drawParticle(particle.x, particle.y, particle.size, particle.angle, particle.color);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(0);
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Sign in attempted:', formData);
    try {
      let response = await signInUser(formData);
      console.log('signInUser', response);
      if(response?.data?.status){
        localStorage.setItem("loggedIn", true);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error while sign in', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen overflow-hidden relative">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
              <Leaf className="h-10 w-10 text-cyan-300" />
            </div>
            <h2 className="text-2xl font-bold ml-3 text-white">Welcome Back</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="backdrop-blur-sm bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white/20 transition-all duration-300"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="backdrop-blur-sm bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white/20 transition-all duration-300"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors">
              Forgot your password?
            </a>
          </div>
          <p className="mt-4 text-center text-sm text-white/70">
            Don't have an account?{" "}
            <a href="/signup" className="text-cyan-300 hover:text-cyan-200 transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
