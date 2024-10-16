import { SignUp } from "@clerk/nextjs";
import { Cog, ThumbsUp, Zap, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col">
        <div className="flex mb-8">
          {/* Left side - Product features */}
          <div className="hidden lg:flex flex-col justify-center w-1/2 pr-12">
            <div className="mb-12">
              <h1 className="text-2xl font-bold text-[#58a6ff] mb-2">
                UniEvent Hub
              </h1>
            </div>
            <div className="space-y-8">
              {[
                {
                  icon: Cog,
                  title: "Adaptable performance",
                  description:
                    "Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.",
                },
                {
                  icon: ThumbsUp,
                  title: "Built to last",
                  description:
                    "Experience unmatched durability that goes above and beyond with lasting investment.",
                },
                {
                  icon: Zap,
                  title: "Great user experience",
                  description:
                    "Integrate our product into your routine with an intuitive and easy-to-use interface.",
                },
                {
                  icon: Rocket,
                  title: "Innovative functionality",
                  description:
                    "Stay ahead with features that set new standards, addressing your evolving needs better than the rest.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <feature.icon className="w-6 h-6 mr-4 text-[#58a6ff]" />
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      {feature.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Sign up form */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <SignUp
              appearance={{
                elements: {
                  formFieldInput: "bg-white border-[#30363d] text-black",
                  footer: "hidden",
                },
              }}
            />
          </div>
        </div>

        {/* Sign-in section */}
        <div className="flex justify-end mt-8 px-20">
          <div className="flex flex-col items-end space-y-2">
            <span className="text-sm text-blue-400">
              Already have an account?
            </span>
            <Button
              className="
                text-sm text-white 
                bg-white bg-opacity-20 
                backdrop-filter backdrop-blur-lg 
                hover:bg-opacity-30 
                transition-all duration-300 
                shadow-lg hover:shadow-xl 
                rounded-full 
                px-6 py-2
                transform hover:-translate-y-0.5
              "
              size="sm"
              asChild
            >
              <Link href="/sign-in" className="flex items-center">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
