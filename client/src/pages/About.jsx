// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="w-full bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 py-20">
      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto">
            To empower individuals with simple yet powerful financial tools to track, save, and grow their money—one transaction at a time.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Vision</h2>
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto">
            A world where everyone has financial clarity and confidence through intelligent tracking and personalized insights.
          </p>
        </motion.div>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-sm">Clear, honest insights into your finances without hidden fees or jargon.</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
              <p className="text-sm">Easy-to-use interface designed for everyone, not just financial experts.</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
              <p className="text-sm">We help you take control of your money through tools and education.</p>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { name: "Martin Gachanja", role: "Founder" },
              { name: "Jane Doe", role: "Backend Engineer" },
              { name: "Alex Lee", role: "Product Designer" },
              { name: "Samira N.", role: "Marketing Lead" },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow"
              >
                <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
