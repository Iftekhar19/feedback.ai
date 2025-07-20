import { Button } from "@/components/ui/button";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t py-8 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left: Logo or Brand */}
        <div className="text-gray-700 text-center md:text-left text-sm">
          © {new Date().getFullYear()} Feedback.ai — Built with ❤️
        </div>

        {/* Right: Social + Contact */}
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:support@feedback.ai">
              <Mail className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
