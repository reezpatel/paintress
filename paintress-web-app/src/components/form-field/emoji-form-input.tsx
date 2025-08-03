import { Controller, useFormContext } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  EmojiPickerContent,
  EmojiPickerSearch,
  EmojiPicker,
} from "../ui/emoji-picker";
import { useState } from "react";

export const EmojiFormInput = ({ name }: { name: string }) => {
  const methods = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={methods.control}
      name={name}
      render={({ field }) => (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="text-[20px]"> {field.value}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <div>
              <EmojiPicker
                className="h-[326px] rounded-lg border shadow-md"
                onEmojiSelect={({ emoji }) => {
                  field.onChange(emoji);
                  setOpen(false);
                }}
                onBlur={field.onBlur}
              >
                <EmojiPickerSearch />
                <EmojiPickerContent />
              </EmojiPicker>
            </div>
          </PopoverContent>
        </Popover>
      )}
    />
  );
};
