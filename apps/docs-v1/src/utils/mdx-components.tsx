export function useMDXComponents() {
  return {
    h1: (props) => (
      <h1
        className="text-4xl font-bold text-gray-900 dark:text-gray-100"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="text-3xl font-semibold text-gray-800 dark:text-gray-200"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-2xl font-medium text-gray-700 dark:text-gray-300"
        {...props}
      />
    ),
    h4: (props) => (
      <h4
        className="text-xl font-medium text-gray-600 dark:text-gray-400"
        {...props}
      />
    ),
    h5: (props) => (
      <h5 className="text-lg font-medium text-gray-500" {...props} />
    ),
    h6: (props) => (
      <h6
        className="text-base font-medium text-gray-400 dark:text-gray-600"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&.state-disabled]:text-gray-400 [&.state-disabled]:cursor-not-allowed text-primary underline-offset-4 hover:underline focus:underline"
        {...props}
      />
    ),
    p: (props) => <p {...props} />,
    ul: (props) => <ul {...props} />,
    ol: (props) => <ol {...props} />,
    li: (props) => <li {...props} />,
    blockquote: (props) => <blockquote {...props} />,
    pre: (props) => <pre data-mdx="true" {...props} />,
  };
}
