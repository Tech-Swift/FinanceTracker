import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "../lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  reason: z.string().nonempty("Select a reason"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const res = await axios.post("/contact", data);

      if (res.status === 200) {
        toast.success("Message sent! We'll get back to you soon.");
        reset();
      } else {
        toast.error(res.data?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Ooops sorry.", err);
      toast.error("Error sending message. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      className="w-full py-20 bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
          We’d love to hear from you. Whether it’s feedback, questions, or a collaboration request.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Input {...register("name")} placeholder="Your name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <Input type="email" {...register("email")} placeholder="you@example.com" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for Contact
              </label>
              <select
                {...register("reason")}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a reason</option>
                <option value="support">Support</option>
                <option value="partnership">Partnership</option>
                <option value="general">General Inquiry</option>
              </select>
              {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Message
              </label>
              <Textarea {...register("message")} rows="5" placeholder="Write your message..." />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            <Button type="submit" disabled={submitting} variant="default" className="w-full">
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {/* Contact Info */}
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-xl font-semibold mb-1">Email</h3>
              <p>support@financetracker.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Phone</h3>
              <p>+254 700 123 456</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Location</h3>
              <p>Nairobi, Kenya</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
              <div className="flex mt-2 space-x-3">
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5 hover:text-blue-600 dark:hover:text-blue-400" />
                </a>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5 hover:text-sky-500 dark:hover:text-sky-400" />
                </a>
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-5 w-5 hover:text-pink-500" />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5 hover:text-blue-700 dark:hover:text-blue-300" />
                </a>
                <a href="#" aria-label="GitHub">
                  <Github className="h-5 w-5 hover:text-gray-700 dark:hover:text-gray-300" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Google Map */}
        <iframe
          title="Google Map"
          className="w-full h-64 rounded-lg border dark:border-gray-700"
          src="https://maps.google.com/maps?q=Nairobi&t=&z=13&ie=UTF8&iwloc=&output=embed"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </motion.section>
  );
}
