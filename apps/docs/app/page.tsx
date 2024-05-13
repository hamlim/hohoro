import { Code } from "bright";
import type { Metadata } from "next";
import { Blockquote, H1, H2, InlineCode, Link, P } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const metadata: Metadata = {
  title: "Hohoro - An incremental JS/TS/TSX library build tool!",
  description: "Hohoro is an incremental JS/TS/TSX library build tool that helps you build your library with ease!",
  authors: [{
    name: "Matt Hamlin",
    url: "https://matthamlin.me",
  }],
};

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  // using a different CSS selector:
  // lightSelector: '[data-theme="light"]',
  lightSelector: "html.light",
  darkSelector: "html.dark",
};

let sectionClasses =
  "py-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 max-w-[75ch] mx-auto min-h-[40vh] flex flex-col justify-center";

export default function Home() {
  return (
    <main>
      <header className={sectionClasses}>
        <H1>Hohoro</H1>
        <P>
          Hohoro is an incremental JS/TS/TSX library build tool that helps you build your library with ease!
        </P>

        <Blockquote>
          <P>
            hohoro is Maori for &quot;make haste&quot; or &quot;hurry up&quot;
          </P>
        </Blockquote>

        <div className="pt-10 flex row justify-center items-center">
          <Button asChild>
            <a href="#installation">Get Started</a>
          </Button>
        </div>
      </header>
      <section id="installation" className={sectionClasses}>
        <H2>Installation</H2>
        <P>
          Install Hohoro via your favorite package manager:
        </P>
        <div className="mt-6">
          <Tabs defaultValue="bun">
            <TabsList>
              <TabsTrigger value="bun">Bun</TabsTrigger>
              <TabsTrigger value="yarn">Yarn</TabsTrigger>
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              <TabsTrigger value="npm">npm</TabsTrigger>
            </TabsList>
            <div className="my-10">
              <TabsContent value="bun">
                <Code lang="shell">
                  bun install hohoro
                </Code>
              </TabsContent>
              <TabsContent value="yarn">
                <Code lang="shell">
                  yarn add hohoro
                </Code>
              </TabsContent>
              <TabsContent value="pnpm">
                <Code lang="shell">
                  pnpm install hohoro
                </Code>
              </TabsContent>
              <TabsContent value="npm">
                <Code lang="shell">
                  npm install hohoro
                </Code>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
      <section className={sectionClasses}>
        <H2>Setup:</H2>
        <P>
          <InlineCode>hohoro</InlineCode> uses{" "}
          <Link href="https://swc.rs/">
            <InlineCode>swc</InlineCode>
          </Link>{" "}
          and{" "}
          <Link href="https://www.typescriptlang.org/">
            <InlineCode>TypeScript</InlineCode>
          </Link>{" "}
          under the hood, leveraging your existing configuration for both tools.
        </P>
      </section>
      <footer className={sectionClasses}>
        <P>
          <Link href="https://github.com/hamlim/hohoro">GitHub</Link>
        </P>
      </footer>
    </main>
  );
}
