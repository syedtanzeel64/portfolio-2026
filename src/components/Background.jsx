import { motion } from 'framer-motion'

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#fafafa] dark:bg-[#09090b] transition-colors duration-300">
      <motion.div
        className="absolute left-[20%] top-[-10%] h-[600px] w-[800px] rounded-full bg-gradient-to-br from-indigo-100/40 via-violet-50/30 to-slate-100/40 dark:from-indigo-900/10 dark:via-violet-900/10 dark:to-slate-900/10 blur-3xl"
        animate={{ y: [0, 40, 0], rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-10%] bottom-[-10%] h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-sky-50/40 via-blue-50/20 to-teal-50/20 dark:from-sky-900/10 dark:via-blue-900/10 dark:to-teal-900/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 opacity-[0.35] dark:opacity-10 mix-blend-multiply dark:mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:24px_24px]" />
    </div>
  )
}
