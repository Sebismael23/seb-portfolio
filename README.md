# Seb's Portfolio

A premium, interactive portfolio website featuring a terminal boot sequence, interactive geometric portrait with hover-reveal wireframe effect, and smooth scroll-driven animations.

## Features

- 🖥️ **Terminal Boot Sequence** - Memorable intro animation
- 🎨 **Interactive Geometric Portrait** - Hover to reveal wireframe mesh
- ✨ **Smooth Animations** - Powered by Framer Motion
- 📱 **Fully Responsive** - Works on all devices
- 🌙 **Dark Theme** - Easy on the eyes
- ⚡ **Fast** - Built with Next.js 14
- 🔍 **SEO Optimized** - Meta tags and Open Graph

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Language:** TypeScript
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Personal Information

Edit `lib/data.ts` to update:
- Your name and bio
- Contact information
- Social links
- Projects
- Skills

### Adding Your Photo

1. Add your photo to `public/images/portrait.jpg`
2. Uncomment the `imageSrc` prop in `components/sections/Hero.tsx`:
```tsx
<GeometricPortrait
  width={280}
  height={350}
  imageSrc="/images/portrait.jpg" // Uncomment this line
/>
```

### Colors

Edit `tailwind.config.ts` to change the color scheme:
```ts
colors: {
  accent: {
    blue: '#3b82f6',    // Primary accent
    purple: '#8b5cf6',  // Secondary accent
    // Add more colors...
  },
}
```

### Boot Sequence Messages

Edit the `bootMessages` array in `lib/data.ts`:
```ts
export const bootMessages = [
  "> initializing your.portfolio...",
  "> loading awesomeness...",
  "> ready."
]
```

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── boot/               # Boot sequence
│   ├── layout/             # Navbar, Footer
│   ├── portrait/           # Geometric portrait
│   ├── sections/           # Page sections
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── data.ts             # All content/data
│   └── utils.ts            # Utility functions
└── public/
    └── images/             # Static images
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy!

### Other Platforms

Build the production version:
```bash
npm run build
```

Then deploy the `.next` folder to your hosting provider.

## Performance Tips

1. **Optimize Images:** Use WebP format for your portrait
2. **Lazy Loading:** Large sections are already set up for viewport-based animations
3. **Font Optimization:** Using Next.js font optimization

## License

MIT License - feel free to use this for your own portfolio!

## Credits

Built with ❤️ by Seb

---

**Questions?** Open an issue or reach out!
