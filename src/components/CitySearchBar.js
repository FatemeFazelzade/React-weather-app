import { useState, useRef, useEffect } from "react";
import cities from "../data/cities.json";
import "../Styles/Style.css";

export default function CitySearchBar({ onSelectCity }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    const cleanValue = value.trim().toLowerCase();

    if (!cleanValue) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const matched = cities
      .filter((city) => city.toLowerCase().startsWith(cleanValue))
      .slice(0, 7);

    setSuggestions(matched);
    setIsOpen(matched.length > 0);
  };

  const handleSelect = (cityName) => {
    setQuery(cityName);
    setIsOpen(false);
    setActiveIndex(-1);

    if (onSelectCity) {
      onSelectCity(cityName);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault();
        handleSelect(query.trim());
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex]);
      } else {
        handleSelect(suggestions[0]);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="city-search-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        placeholder="Search for a city..."
        className="city-search-input"
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="city-suggestions"
        aria-autocomplete="list"
      />

      {isOpen && suggestions.length > 0 && (
        <ul id="city-suggestions" className="city-dropdown" role="listbox">
          {suggestions.map((city, index) => (
            <li
              key={city}
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(city)}
              className={`city-dropdown-item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
