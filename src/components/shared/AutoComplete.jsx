"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export default function Autocomplete({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder,
  autoComplete,
  error,
  getOptionLabel = (option) => option.name || "",
  getOptionValue = (option) => option.name || "",
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Use useMemo for filteredOptions to avoid unnecessary re-renders
  const filteredOptions = useMemo(() => {
    if (!inputValue) {
      return options;
    }
    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options, getOptionLabel]);

  // Determine dropdown position
  useEffect(() => {
    if (isOpen && dropdownRef.current && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = windowHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen, filteredOptions]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(!!newValue); // Open dropdown if input is non-empty
  }, []);

  const handleOptionSelect = useCallback(
    (option) => {
      const optionValue = getOptionValue(option);
      console.log(optionValue);

      setInputValue(optionValue);
      onChange(optionValue);
      setIsOpen(false);
    },
    [onChange, getOptionValue]
  );

  const handleInputFocus = useCallback(() => {
    setIsOpen(!!inputValue || options.length > 0); // Open dropdown on focus if input non-empty or options exist
  }, [inputValue, options]);

  //   const handleInputBlur = useCallback(() => {
  //     setTimeout(() => {
  //       const matchedOption = options.find(
  //         (option) =>
  //           getOptionLabel(option).toLowerCase() === inputValue.toLowerCase()
  //       );
  //       if (matchedOption) {
  //         const optionValue = getOptionValue(matchedOption);
  //         setInputValue(optionValue);
  //         onChange(optionValue);
  //       } else {
  //         setInputValue("");
  //         onChange("");
  //       }
  //       setIsOpen(false);
  //     }, 200); // Delay to allow option click
  //   }, [inputValue, options, onChange, getOptionValue]);

  return (
    <div
      className="woocomerce__checkout-rformfield"
      style={{ position: "relative" }}
    >
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="form-control"
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        // onBlur={handleInputBlur}
        disabled={disabled}
        ref={inputRef}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="dropdown-menu show"
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            borderColor: "#dee2e6",
            backgroundColor: "rgb(235 235 235)",
            color: "#212529",
            top: dropdownPosition === "bottom" ? "100%" : "auto",
            bottom: dropdownPosition === "top" ? "100%" : "auto",
          }}
        >
          {filteredOptions.map((option) => (
            <li
              key={getOptionValue(option)}
              className="dropdown-item"
              onClick={() => handleOptionSelect(option)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  getOptionValue(option) === value ? "#f8f9fa" : "transparent",
                color: "#212529",
              }}
            >
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <span className="warning_text text-danger" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
