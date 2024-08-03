import { StarIcon } from "@radix-ui/react-icons";
import { Code } from "bright";
import type { Metadata } from "next";
import {
  Blockquote,
  H1,
  H2,
  InlineCode,
  Link,
  P,
} from "~/components/typography";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const metadata: Metadata = {
  title: "Hohoro - An incremental JS/TS/TSX library build tool!",
  description:
    "Hohoro is an incremental JS/TS/TSX library build tool that helps you build your library with ease!",
  authors: [
    {
      name: "Matt Hamlin",
      url: "https://matthamlin.me",
    },
  ],
};

Code.theme = {
  dark: "github-dark",
  light: "github-light",
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
          Hohoro is an incremental JS/TS/TSX library build tool that helps you
          build your library with ease!
        </P>

        <Blockquote>
          <P>
            hohoro is Maori for &quot;make haste&quot; or &quot;hurry up&quot;
          </P>
        </Blockquote>

        <div className="pt-10 flex row justify-evenly items-center">
          <Button asChild>
            <a href="#installation">Get Started</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/hamlim/hohoro">
              <StarIcon className="mr-2 inline-flex" /> Star on GitHub
            </a>
          </Button>
        </div>
      </header>
      <section id="installation" className={sectionClasses}>
        <H2>Installation</H2>
        <P>Install Hohoro via your favorite package manager:</P>
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
                <Code lang="shell">bun install hohoro</Code>
              </TabsContent>
              <TabsContent value="yarn">
                <Code lang="shell">yarn add hohoro</Code>
              </TabsContent>
              <TabsContent value="pnpm">
                <Code lang="shell">pnpm install hohoro</Code>
              </TabsContent>
              <TabsContent value="npm">
                <Code lang="shell">npm install hohoro</Code>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
      <section id="setup" className={sectionClasses}>
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
        <P>
          If you haven&apos;t yet, you&apos;ll want to install both tools and
          setup local configuration for them.
        </P>
        <details className="mt-4">
          <summary>Recommendations:</summary>
          <div className="border-l-2 border-slate pl-4 ml-2 mt-2">
            <P>
              For <InlineCode>swc</InlineCode> I recommend using{" "}
              <Link href="https://swc.rs/docs/configuration/swcrc">
                the official configuration guide
              </Link>{" "}
              to create a <InlineCode>.swcrc</InlineCode> file.
            </P>
            <P>
              For <InlineCode>TypeScript</InlineCode> I recommend using{" "}
              <Link href="https://tsconfig.guide/">tsconfig.guide</Link> (a
              minimal UI on top of{" "}
              <Link href="https://www.totaltypescript.com/tsconfig-cheat-sheet">
                Matt Pocock&apos;s TSConfig Cheat Sheet
              </Link>
              ) to create a <InlineCode>tsconfig.json</InlineCode> file.
            </P>
          </div>
        </details>
        <P>
          Once the above tools are configured however you&apos;d like, you can
          set your <InlineCode>build</InlineCode> script to the{" "}
          <InlineCode>hohoro</InlineCode> binary:
        </P>

        <Code lang="json">
          {`{
  "scripts": {
    "build": "hohoro"
  }
}`}
        </Code>
        <P>
          Then run <InlineCode>build</InlineCode> to build your project!
        </P>
      </section>
      <section id="tips" className={sectionClasses}>
        <H2>Watch Mode</H2>
        <P>
          By default, <InlineCode>hohoro</InlineCode> does not automatically
          watch your project for changes and rebuild. Instead you can combine{" "}
          <InlineCode>hohoro</InlineCode> with{" "}
          <InlineCode>node --watch</InlineCode> to achieve this!
        </P>
        <P>
          To get started, you&apos;ll need a local{" "}
          <InlineCode>dev.mjs</InlineCode> script:
        </P>
        <Code lang="javascript">{`// dev.mjs
import { runBuild } from "hohoro";

await runBuild({ rootDirectory: process.cwd(), logger: console });`}</Code>
        <P>
          Then add a <InlineCode>dev</InlineCode> script to your{" "}
          <InlineCode>package.json</InlineCode>:
        </P>
        <Code lang="json">{`{
  "scripts": {
    "dev": "node --watch-path=./src dev.mjs"
  }
}`}</Code>
      </section>
      <footer className={sectionClasses}>
        <P>
          The source code for the library is available on{" "}
          <Link href="https://github.com/hamlim/hohoro">GitHub</Link>. If you
          run into any bugs, please report them via{" "}
          <Link href="https://github.com/hamlim/hohoro/issues/new">issues</Link>
          .
        </P>
        <P>
          If you&apos;d like to discuss changes to the project, feel free to
          start a{" "}
          <Link href="https://github.com/hamlim/hohoro/discussions/new/choose">
            discussion
          </Link>
          !
        </P>
      </footer>
    </main>
  );
}
