import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <section className="flex items-center justify-center h-[90vh] bg-background">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                Sort your notes easily
              </span>
            </span>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
              Create notes with ease{" "}
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Accusantium, minus laborum? ctetur .
            </p>
          </div>
          <div className="flex items-center justify-center mt-10 max-w-xs mx-auto">
            <Button size={"lg"} className="w-full">
              Sign up for free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
