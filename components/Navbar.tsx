export default function Navbar() {
  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-gray-900">
          Seb Development
        </a>
        <div className="flex gap-6">
          <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
          <a href="#work" className="text-gray-600 hover:text-gray-900">Work</a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
        </div>
      </div>
    </nav>
  );
}