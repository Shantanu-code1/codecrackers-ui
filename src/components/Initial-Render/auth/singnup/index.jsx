import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';
import signuporloginStore from '../../../../zustand/login-signup/store';
import { toast } from 'react-toastify';

export default function SignupPage() {

  const { signUpUser } = signuporloginStore();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phoneNumber: '', role: 'ROLE_STUDENT' });
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const leaves = [];

    for (let i = 0; i < 50; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 5,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * 360,
        color: `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`
      });
    }

    function drawLeaf(x, y, size, angle, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI / 180);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.quadraticCurveTo(size / 2, -size / 2, size / 2, 0);
      ctx.quadraticCurveTo(size / 2, size / 2, 0, size / 2);
      ctx.quadraticCurveTo(-size / 2, size / 2, -size / 2, 0);
      ctx.quadraticCurveTo(-size / 2, -size / 2, 0, -size / 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leaves.forEach(leaf => {
        leaf.y += leaf.speed;
        leaf.angle += 0.1;
        if (leaf.y > canvas.height) {
          leaf.y = -leaf.size;
          leaf.x = Math.random() * canvas.width;
        }
        drawLeaf(leaf.x, leaf.y, leaf.size, leaf.angle, leaf.color);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(0);
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      console.log('Form submitted:', formData);
      let res = await signUpUser(formData)
      localStorage.setItem("email", formData.email);
      console.log('res', res);
      if(res?.data?.status){
       navigate('/verify');

        toast.success("Verify Otp")
      }
      else{
        if(res?.data?.message === "Verification email sent again"){
          navigate('/verify');
          toast.success("Verify Otp")
        }
        else{
          toast.success("Sign in insted of loging")
        }
      }
    } catch (error) {
      console.log('Error while signUp', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className="bg-[#0D1117] min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#161B22] backdrop-blur-md rounded-lg p-8 shadow-lg border border-[#30363D]">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-10 w-10 text-[#7C39E7]" />
            <h2 className="text-2xl font-bold ml-2 text-[#E5E7EB]">Grow With Us</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#E5E7EB]">Your Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#7C39E7] focus:border-[#7C39E7]"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#E5E7EB]">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#7C39E7] focus:border-[#7C39E7]"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#E5E7EB]">Phone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="phoneNumber"
                required
                className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#7C39E7] focus:border-[#7C39E7]"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[#E5E7EB]">Your Role</Label>
              <Select name="role" onValueChange={(value) => handleSelectChange('role', value)}>
                <SelectTrigger className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[#161B22] border-[#30363D] text-[#E5E7EB]">
                  <SelectItem value="ROLE_STUDENT">Student</SelectItem>
                  <SelectItem value="ROLE_TEACHER">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#E5E7EB]">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#7C39E7] focus:border-[#7C39E7]"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" className="w-full bg-[#7C39E7] hover:bg-indigo-700">
              Join Our Community
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[#A1A1AA]">
            Already have an account?{" "}
            <a href="/login" className="text-[#7C39E7] hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
