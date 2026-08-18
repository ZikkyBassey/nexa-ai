import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { routeForInput } from "@/lib/chains/detect";

export function SearchBar({
  size = "lg",
  placeholder = "Search a wallet, transaction, token — or just ask a question",
  initialValue = "",
}: {
  size?: "lg" | "sm";
  placeholder?: string;
  initialValue?: string;
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const query = value.trim();
    if (query.length < 3) {
      setError("Enter an address, a signature, or a question.");
      return;
    }
    setError(null);
    const target = routeForInput(query);
    void navigate({
      to: target.to,
      ...(target.params ? { params: target.params } : {}),
      ...(target.search ? { search: target.search } : {}),
    } as never);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`flex items-center gap-2 rounded-2xl border border-border bg-card/80 backdrop-blur transition-colors focus-within:border-primary/50 ${
          size === "lg" ? "p-2 pl-4" : "p-1.5 pl-3"
        }`}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Search the blockchain"
          className={`min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground ${
            size === "lg" ? "py-2.5 text-base" : "py-1.5 text-sm"
          }`}
        />
        <Button
          type="submit"
          size={size === "lg" ? "default" : "sm"}
          className="rounded-xl font-medium"
        >
          Explore
        </Button>
      </div>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </form>
  );

}
