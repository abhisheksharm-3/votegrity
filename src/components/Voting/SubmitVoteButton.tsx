import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SubmitVoteButtonProps {
  isVoting: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
}

export function SubmitVoteButton({ isVoting, isDisabled, onSubmit }: SubmitVoteButtonProps) {
  return (
    <Button 
      className="mt-8 w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/80 hover:to-primary/80 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
      size="lg"
      onClick={onSubmit}
      disabled={isVoting || isDisabled}
    >
      {isVoting ? (
        <span className="flex items-center justify-center">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            ⏳
          </motion.span>
          Submitting Vote...
        </span>
      ) : (
        "Submit Vote"
      )}
    </Button>
  );
}