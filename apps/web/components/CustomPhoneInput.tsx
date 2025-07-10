"use client";
import {
  Combobox,
  Group,
  InputBase,
  ScrollArea,
  Text,
  useCombobox,
} from "@mantine/core";
import { FieldValues } from "react-hook-form";
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";

interface CustomPhoneInputProps<T extends FieldValues = FieldValues> {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label: string;
}

const CustomPhoneInput = ({
  onChange,
  value,
  onBlur,
  error,
  label,
}: CustomPhoneInputProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "tr",
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  const selectedCountry = defaultCountries.find((item) => {
    const parsedCountry = parseCountry(item);
    return parsedCountry.iso2 === country.iso2;
  });

  return (
    <InputBase
      onBlur={onBlur}
      error={error}
      label={label}
      leftSection={
        <Combobox
          store={combobox}
          withinPortal={true}
          onOptionSubmit={(value) => {
            setCountry(value as CountryIso2);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "0 8px",
                borderRight: "1px solid var(--mantine-color-gray-3)",
                backgroundColor: "transparent",
              }}
              onClick={() => {
                combobox.toggleDropdown();
              }}
            >
              {selectedCountry && (
                <FlagImage
                  iso2={parseCountry(selectedCountry).iso2}
                  style={{
                    width: "24px",
                    height: "16px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </Combobox.Target>

          <Combobox.Dropdown
            style={{
              zIndex: 1000,
              width: "fit-content",
              minWidth: "max-content",
            }}
          >
            <ScrollArea.Autosize
              mah={200}
              style={{
                width: "fit-content",
                minWidth: "max-content",
              }}
            >
              <Combobox.Options
                style={{
                  width: "fit-content",
                  minWidth: "max-content",
                }}
              >
                {defaultCountries.map((country) => {
                  const parsedCountry = parseCountry(country);
                  return (
                    <Combobox.Option
                      key={parsedCountry.iso2}
                      value={parsedCountry.iso2}
                    >
                      <Group gap="xs" align="center">
                        <div style={{ width: 24, height: 16 }}>
                          <FlagImage
                            iso2={parsedCountry.iso2}
                            style={{
                              width: "24px",
                              height: "16px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <Text fz="xs">
                          (+{parsedCountry.dialCode}) {parsedCountry.name}
                        </Text>
                      </Group>
                    </Combobox.Option>
                  );
                })}
              </Combobox.Options>
            </ScrollArea.Autosize>
          </Combobox.Dropdown>
        </Combobox>
      }
      leftSectionWidth={48}
      ref={inputRef}
      value={inputValue}
      onChange={handlePhoneValueChange}
    />
  );
};

export default CustomPhoneInput;
