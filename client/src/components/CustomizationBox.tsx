import { Button, ColorInput, Divider, Group, InputLabel, NumberInput, SimpleGrid, Slider, Stack, Text, TextInput } from '@mantine/core'
import axios from 'axios'
import React from 'react'

export interface CustomizationOptions {
  textFormat: string
  fontSize: number
  fontWeight: number
  fontFamily: string
  textColor: string
  textStrokeColor: string
  textStrokeWidth: number
  textShadowColor: string
  textShadowBlur: number
  textShadowOffsetX: number
  textShadowOffsetY: number
}

type Props = {
  defaultOptions: CustomizationOptions
  onChange: (options: CustomizationOptions) => void
}

export default function CustomizationBox({ defaultOptions, onChange }: Props) {
  const [options, setOptions] = React.useState(defaultOptions)
  const updateOptions = (newOptions: Partial<CustomizationOptions>) => {
    setOptions((prev) => {
      const next = { ...prev, ...newOptions }
      onChange(next)
      return next
    })
  }

  const saveOptions = () => {
    axios.post('/api/update_options', { options })
  }
  return (
    <Stack gap="0" my="sm">
      <Divider label="Font Customization" labelPosition="left" />
      <SimpleGrid cols={2} spacing={8} verticalSpacing={2}>
        <TextInput
          label="Font Family"
          value={options.fontFamily}
          onChange={(e) => {
            updateOptions({ fontFamily: e.currentTarget.value })
          }}
        />
        <ColorInput
          label="Text Color"
          value={options.textColor}
          onChange={(val) => {
            updateOptions({ textColor: val })
          }}
        />
        <NumberInput
          label="Font Size"
          value={options.fontSize}
          rightSection={
            <Text size="sm" style={{ color: 'var(--mantine-color-gray-6)' }}>
              px
            </Text>
          }
          min={0}
          onValueChange={(val) => {
            val.floatValue && updateOptions({ fontSize: val.floatValue })
          }}
        />
        <NumberInput
          label="Font Weight"
          value={options.fontWeight}
          onChange={(e) => {
            let val = Number(e)

            updateOptions({ fontWeight: val })
          }}
          step={100}
          min={200}
        />
      </SimpleGrid>
      <Divider label="Stroke Customization" labelPosition="left" mt="sm" />

      <SimpleGrid cols={2} spacing={8} verticalSpacing={2}>
        <ColorInput
          label="Text Stroke Color"
          value={options.textStrokeColor}
          onChange={(val) => {
            updateOptions({ textStrokeColor: val })
          }}
        />
        <Stack justify="end" gap={0}>
          <InputLabel size="sm"> Text Stroke Width (px)</InputLabel>
          <Slider
            label={(val) => `${val}px`}
            value={options.textStrokeWidth}
            onChange={(val) => {
              updateOptions({ textStrokeWidth: val })
            }}
            min={0}
            max={25}
          />
        </Stack>
      </SimpleGrid>
      <Divider label="Shadow Customization" labelPosition="left" mt="sm" />
      <SimpleGrid cols={2} spacing={8} verticalSpacing={12}>
        <ColorInput
          label="Text Shadow Color"
          value={options.textShadowColor}
          onChange={(val) => {
            updateOptions({ textShadowColor: val })
          }}
        />
        <Stack justify="end" gap={0}>
          <InputLabel size="sm"> Text Shadow Blur</InputLabel>
          <Slider
            label="Text Shadow Blur"
            value={options.textShadowBlur}
            onChange={(val) => {
              updateOptions({ textShadowBlur: val })
            }}
            min={0}
            max={10}
          />
        </Stack>
        <Stack justify="end" gap={0}>
          <InputLabel size="sm"> Text Shadow Offset X (px)</InputLabel>
          <Slider
            label={(val) => `${val}px`}
            value={options.textShadowOffsetX}
            onChange={(val) => {
              updateOptions({ textShadowOffsetX: val })
            }}
            min={-10}
            max={10}
          />
        </Stack>
        <Stack justify="end" gap={0}>
          <InputLabel size="sm"> Text Shadow Offset Y (px)</InputLabel>
          <Slider
            label={(val) => `${val}px`}
            value={options.textShadowOffsetY}
            onChange={(val) => {
              updateOptions({ textShadowOffsetY: val })
            }}
            min={-10}
            max={10}
          />
        </Stack>
      </SimpleGrid>
      <TextInput
        label="Text Format"
        value={options.textFormat}
        onChange={(e) => {
          updateOptions({ textFormat: e.currentTarget.value })
        }}
      />
      <Group w="100%" mt={6} justify="end">
        <Button color="green" onClick={saveOptions}>
          Save
        </Button>
      </Group>
    </Stack>
  )
}
