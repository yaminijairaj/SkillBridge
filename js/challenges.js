// challenges.js - Static challenge data
const challengesData = [
    {
        id: 'c1',
        title: 'Array Reversal Algorithm',
        category: 'JavaScript',
        difficulty: 'Easy',
        duration: 10, // minutes
        description: 'Write a function reverseArray(arr) that takes an array and returns a new array with the elements in reverse order. Do not use the built-in Array.reverse() method.',
        descriptionHtml: `
            <h4>Instructions</h4>
            <p>Write a function <code>reverseArray(arr)</code> that takes an array and returns a new array with the elements in reverse order. Do not use the built-in <code>Array.reverse()</code> method.</p>
            <h4>Example</h4>
            <p><code>reverseArray([1, 2, 3]) // [3, 2, 1]</code></p>
        `,
        starterCode: `function reverseArray(arr) {\n    // Your code here\n    \n}\n`,
        referenceTokens: ['for', 'let', 'i', 'arr.length', '-1', 'push']
    },
    {
        id: 'c2',
        title: 'CSS Grid Layout',
        category: 'HTML/CSS',
        difficulty: 'Medium',
        duration: 20,
        description: 'Create a responsive 3-column masonry grid layout using CSS Grid.',
        descriptionHtml: `
            <h4>Instructions</h4>
            <p>Write CSS to create a 3-column grid container that collapses to 1 column on mobile screens (< 768px). Use CSS Grid.</p>
            <h4>Requirements</h4>
            <ul>
                <li>Gap between items: 16px</li>
                <li>Desktop: 3 equal flex columns</li>
                <li>Mobile: 1 column</li>
            </ul>
        `,
        starterCode: `.grid-container {\n    display: grid;\n    /* Your CSS here */\n}\n\n@media (max-width: 768px) {\n    .grid-container {\n        \n    }\n}\n`,
        referenceTokens: ['grid-template-columns', 'repeat', 'minmax', '1fr']
    },
    {
        id: 'c3',
        title: 'Prime Number Validator (Optimized)',
        category: 'Python',
        difficulty: 'Medium',
        duration: 15,
        description: 'Write a Python function to check if a number is prime, optimized for O(sqrt(n)).',
        descriptionHtml: `
            <h4>Instructions</h4>
            <p>Write a function <code>is_prime(n)</code> that returns True if n is a prime number, and False otherwise.</p>
            <p>Optimize your solution to check only up to the square root of n.</p>
        `,
        starterCode: `def is_prime(n):\n    # Your code here\n    pass\n`,
        referenceTokens: ['import', 'math', 'sqrt', 'range', 'int']
    }
];
