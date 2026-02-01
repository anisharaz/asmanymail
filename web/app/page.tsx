"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Inbox,
  Shield,
  Zap,
  Database,
  Infinity,
  Lock,
  Cloud,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Mail className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AsManyMail</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/welcome">
              <Button className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium animate-pulse"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 inline" />
              Unlimited Email Addresses
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground"
          >
            Create Unlimited Emails
            <br />
            <span className="text-primary">Without Limits</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Generate as many email addresses as you need. All your emails are
            persistent, secure, and stored with full attachment support.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/welcome">
              <Button size="lg" className="text-lg px-8 group">
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard/mails">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Inbox className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Cards Animation */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-5xl mx-auto mt-20 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Infinity,
                title: "Unlimited Emails",
                desc: "Create as many addresses as you need",
                delay: 0,
              },
              {
                icon: Database,
                title: "Persistent Storage",
                desc: "All emails stored permanently",
                delay: 0.1,
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is protected",
                delay: 0.2,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + feature.delay }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="border-2 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for Email Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make email management effortless
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Instant Creation",
                desc: "Create new email addresses instantly without any waiting period or verification.",
              },
              {
                icon: Database,
                title: "Full Attachments",
                desc: "Send and receive attachments with full support for all file types.",
              },
              {
                icon: Cloud,
                title: "Cloud Storage",
                desc: "All your emails and attachments are stored securely in the cloud.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Sign Up",
                desc: "Create your account in seconds. No credit card required.",
              },
              {
                step: "02",
                title: "Generate Emails",
                desc: "Create as many email addresses as you need with one click.",
              },
              {
                step: "03",
                title: "Start Receiving",
                desc: "All your emails appear instantly in your organized inbox.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex gap-6 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-lg text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "∞", label: "Email Addresses" },
              { value: "100%", label: "Persistent Storage" },
              { value: "24/7", label: "Always Available" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center"
        >
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-card via-card to-muted/20 border-2">
            <CardContent className="p-12">
              <Mail className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who manage unlimited email addresses
                with ease. Start creating your emails today.
              </p>
              <Link href="/welcome">
                <Button size="lg" className="text-lg px-10 group">
                  Create Your First Email
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-semibold">AsManyMail</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 AsManyMail. Unlimited emails, unlimited possibilities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
