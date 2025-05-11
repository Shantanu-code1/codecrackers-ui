"use client"

import React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"


export function MultiSelect({ options, selected = [], onChange, placeholder, className }) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState(selected.map(item => item.value))

  // Update internal state when selected prop changes from outside
  React.useEffect(() => {
    if (selected) {
      setSelectedValues(selected.map(item => item.value));
    }
  }, [selected]);

  const handleSelect = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    setSelectedValues(newSelectedValues);
    
    // Call the onChange prop with the updated selection
    if (onChange) {
      // Convert values back to objects with value and label
      const selectedObjects = newSelectedValues.map(value => {
        const option = options.find(opt => opt.value === value);
        return { value, label: option?.label || value };
      });
      onChange(selectedObjects);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedValues.length > 0 ? (
              selectedValues.map((value) => (
                <Badge key={value} variant="secondary">
                  {options.find((option) => option.value === value)?.label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder || "Select options..."}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." className="h-9" />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedValues.includes(option.value) ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

