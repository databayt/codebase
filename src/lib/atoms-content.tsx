// Simple content components for atoms pages
// This avoids MDX compilation issues

export function IntroductionContent() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="lead">
        <strong>This is not a component library. It is how you build your component library.</strong>
      </p>

      <p>
        You know how most traditional component libraries work: you install a package from NPM, import the components, and use them in your app.
      </p>

      <p>
        This approach works well until you need to customize a component to fit your design system or require one that isn't included in the library. <strong>Often, you end up wrapping library components, writing workarounds to override styles, or mixing components from different libraries with incompatible APIs.</strong>
      </p>

      <p>
        This is what our atoms collection aims to solve. It is built around the following principles:
      </p>

      <ul>
        <li><strong>Open Code:</strong> The top layer of your component code is open for modification.</li>
        <li><strong>Composition:</strong> Every component uses a common, composable interface, making them predictable.</li>
        <li><strong>Distribution:</strong> A flat-file schema and command-line tool make it easy to distribute components.</li>
        <li><strong>Beautiful Defaults:</strong> Carefully chosen default styles, so you get great design out-of-the-box.</li>
        <li><strong>AI-Ready:</strong> Open code for LLMs to read, understand, and improve.</li>
      </ul>

      <h2>Open Code</h2>

      <p>
        Our atoms give you the actual component code. You have full control to customize and extend the components to your needs. This means:
      </p>

      <ul>
        <li><strong>Full Transparency:</strong> You see exactly how each component is built.</li>
        <li><strong>Easy Customization:</strong> Modify any part of a component to fit your design and functionality requirements.</li>
        <li><strong>AI Integration:</strong> Access to the code makes it straightforward for LLMs to read, understand, and even improve your components.</li>
      </ul>

      <p className="italic">
        In a typical library, if you need to change a button's behavior, you have to override styles or wrap the component. With our atoms, you simply edit the component code directly.
      </p>

      <h2>Composition</h2>

      <p>
        Every component in our atoms collection shares a common, composable interface. <strong>If a component does not exist, we bring it in, make it composable, and adjust its style to match and work with the rest of the design system.</strong>
      </p>

      <p className="italic">
        A shared, composable interface means it's predictable for both your team and LLMs. You are not learning different APIs for every new component. Even for third-party ones.
      </p>

      <h2>Distribution</h2>

      <p>
        Our atoms collection is also a code distribution system. It defines a schema for components and a CLI to distribute them.
      </p>

      <ul>
        <li><strong>Schema:</strong> A flat-file structure that defines the components, their dependencies, and properties.</li>
        <li><strong>CLI:</strong> A command-line tool to distribute and install components across projects with cross-framework support.</li>
      </ul>

      <p className="italic">
        You can use the schema to distribute your components to other projects or have AI generate completely new components based on existing schema.
      </p>

      <h2>Beautiful Defaults</h2>

      <p>
        Our atoms come with a large collection of components that have carefully chosen default styles. They are designed to look good on their own and to work well together as a consistent system:
      </p>

      <ul>
        <li><strong>Good Out-of-the-Box:</strong> Your UI has a clean and minimal look without extra work.</li>
        <li><strong>Unified Design:</strong> Components naturally fit with one another. Each component is built to match the others, keeping your UI consistent.</li>
        <li><strong>Easily Customizable:</strong> If you want to change something, it's simple to override and extend the defaults.</li>
      </ul>

      <h2>AI-Ready</h2>

      <p>
        The design of our atoms makes it easy for AI tools to work with your code. Its open code and consistent API allow AI models to read, understand, and even generate new components.
      </p>

      <p className="italic">
        An AI model can learn how your components work and suggest improvements or even create new components that integrate with your existing design.
      </p>

      <h2>Getting Started</h2>

      <p>
        Browse through the categories in the sidebar to explore all available components. Each component page includes:
      </p>

      <ul>
        <li>Live examples and demos</li>
        <li>Complete source code</li>
        <li>Installation instructions</li>
        <li>Customization options</li>
        <li>Usage guidelines</li>
      </ul>

      <p>Start building with atoms today!</p>
    </div>
  )
}
