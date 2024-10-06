"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Wand2Icon, PaletteIcon, MoreVerticalIcon } from "lucide-react"

export default function MagicButtonCreator() {
  const [buttonName, setButtonName] = useState("")
  const [buttonColor, setButtonColor] = useState("#3b82f6")
  const [buttonIcon, setButtonIcon] = useState("✨")
  const [buttonDescription, setButtonDescription] = useState("")
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  const nameSuggestions = [
    "Abracadabra",
    "Hocus Pocus",
    "Presto",
    "Alakazam",
    "Shazam",
  ]

  const iconOptions = ["✨", "🔮", "🎩", "🪄", "🧙‍♂️", "🧚"]

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">


      <div className="space-y-2">
        <Label htmlFor="button-name">Button Name</Label>
        <div className="flex space-x-2">
          <Input
            id="button-name"
            value={buttonName}
            onChange={(e) => setButtonName(e.target.value)}
            placeholder="Enter button name"
          />
          <Select onValueChange={(value) => setButtonName(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Suggestions" />
            </SelectTrigger>
            <SelectContent>
              {nameSuggestions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Button Style</Label>
        <div className="flex space-x-2">
          <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[80px] p-0"
                onClick={() => setIsColorPickerOpen(true)}
              >
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: buttonColor }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Choose Color</h4>
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Select onValueChange={(value) => setButtonIcon(value)}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="button-description">Button Purpose</Label>
        <Textarea
          id="button-description"
          value={buttonDescription}
          onChange={(e) => setButtonDescription(e.target.value)}
          placeholder="Describe what your magic button does..."
          rows={4}
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          style={{ backgroundColor: buttonColor }}
          className="text-white"
        >
          {buttonIcon} {buttonName || "Magic Button"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Wand2Icon className="mr-2 h-4 w-4" />
              <span>Generate Random</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PaletteIcon className="mr-2 h-4 w-4" />
              <span>Advanced Styling</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}