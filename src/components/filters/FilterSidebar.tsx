'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FilterSection {
  id: string
  name: string
  options: { value: string; label: string; count?: number }[]
}

const filterSections: FilterSection[] = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'hijab', label: 'Hijab', count: 245 },
      { value: 'gamis', label: 'Gamis & Abaya', count: 189 },
      { value: 'khimar', label: 'Khimar', count: 134 },
      { value: 'mukena', label: 'Mukena', count: 87 },
      { value: 'tops', label: 'Tops', count: 124 },
      { value: 'dresses', label: 'Dresses', count: 89 },
      { value: 'bottoms', label: 'Bottoms', count: 156 },
      { value: 'outerwear', label: 'Outerwear', count: 67 },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
      { value: 'xxl', label: 'XXL' },
    ],
  },
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'black', label: 'Black' },
      { value: 'white', label: 'White' },
      { value: 'beige', label: 'Beige' },
      { value: 'brown', label: 'Brown' },
      { value: 'navy', label: 'Navy' },
      { value: 'grey', label: 'Grey' },
      { value: 'pink', label: 'Pink' },
      { value: 'red', label: 'Red' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    options: [
      { value: '0-100000', label: 'Under Rp 100.000' },
      { value: '100000-200000', label: 'Rp 100.000 - Rp 200.000' },
      { value: '200000-500000', label: 'Rp 200.000 - Rp 500.000' },
      { value: '500000-1000000', label: 'Rp 500.000 - Rp 1.000.000' },
      { value: '1000000+', label: 'Over Rp 1.000.000' },
    ],
  },
]

interface FilterSidebarProps {
  selectedFilters: Record<string, string[]>
  onFilterChange: (filterId: string, value: string) => void
  onClearAll: () => void
}

export function FilterSidebar({ selectedFilters, onFilterChange, onClearAll }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    filterSections.map((s) => s.id)
  )

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const totalSelected = Object.values(selectedFilters).flat().length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {totalSelected > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:underline"
          >
            Clear All ({totalSelected})
          </button>
        )}
      </div>

      {/* Filter Sections */}
      {filterSections.map((section) => (
        <div key={section.id} className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between w-full py-2 text-left"
          >
            <span className="font-medium">{section.name}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.includes(section.id) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.includes(section.id) && (
            <div className="mt-2 space-y-2">
              {section.id === 'size' ? (
                // Size grid layout
                <div className="grid grid-cols-3 gap-2">
                  {section.options.map((option) => {
                    const isSelected = selectedFilters[section.id]?.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        onClick={() => onFilterChange(section.id, option.value)}
                        className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              ) : section.id === 'color' ? (
                // Color swatches
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option) => {
                    const isSelected = selectedFilters[section.id]?.includes(option.value)
                    const colorMap: Record<string, string> = {
                      black: '#000000',
                      white: '#FFFFFF',
                      beige: '#F5F5DC',
                      brown: '#8B4513',
                      navy: '#000080',
                      grey: '#808080',
                      pink: '#FFC0CB',
                      red: '#FF0000',
                    }
                    return (
                      <button
                        key={option.value}
                        onClick={() => onFilterChange(section.id, option.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                        } ${option.value === 'white' ? 'border-gray-300' : 'border-transparent'}`}
                        style={{ backgroundColor: colorMap[option.value] }}
                        title={option.label}
                      />
                    )
                  })}
                </div>
              ) : (
                // Checkbox list
                <div className="space-y-2">
                  {section.options.map((option) => {
                    const isSelected = selectedFilters[section.id]?.includes(option.value)
                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onFilterChange(section.id, option.value)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Mobile Filter Drawer
interface MobileFiltersProps {
  isOpen: boolean
  onClose: () => void
  selectedFilters: Record<string, string[]>
  onFilterChange: (filterId: string, value: string) => void
  onClearAll: () => void
}

export function MobileFilters({
  isOpen,
  onClose,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: MobileFiltersProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClearAll}>
            Clear All
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
