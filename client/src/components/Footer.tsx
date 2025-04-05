import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Star, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const emailInput = target.elements.namedItem("email") as HTMLInputElement;

    if (emailInput.value) {
      toast({
        title: "Subscribed!",
        description: "You have been subscribed to our newsletter.",
      });
      emailInput.value = "";
    }
  };

  return (
    <footer className="bg-[#1A4A4A] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-[#E9927E] text-2xl font-semibold mb-4">
              letsmove
            </h2>
            <p className="text-[#C9DAD0]/80 max-w-xs">
              Find your perfect apartment with personalized, hyper-local search
              results.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Explore</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/listings"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    Search
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/listings?type=neighborhoods"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    Neighborhoods
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/listings?type=buildings"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    Buildings
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/search-party"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    Search Parties
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/about"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/how-it-works"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/faq"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact"
                    className="text-[#C9DAD0]/80 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-medium mb-3">Stay Updated</h3>
              <p className="text-[#C9DAD0]/80 mb-3">
                Get the latest listings in your area
              </p>
              <form className="flex flex-1 gap-2" onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="px-3 py-2 rounded-lg w-full focus:outline-none text-[#1A4A4A]"
                />
                <Button
                  type="submit"
                  className="bg-[#E9927E] text-white px-4 py-2 rounded-lg hover:bg-[#E9927E]/90"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#C9DAD0]/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#C9DAD0]/60 text-sm">
            © 2023 letsmove. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-[#C9DAD0]/80 hover:text-white transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-[#C9DAD0]/80 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-[#C9DAD0]/80 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-[#C9DAD0]/80 hover:text-white transition-colors"
            >
              <Star className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
