export const defaultTextOptions: CustomizationOptions = {
  fontFamily: 'Segoe UI',
  fontSize: 48,
  fontWeight: 500,
  textColor: '#ffffff',
  textStrokeColor: '#000000',
  textStrokeWidth: 4,
  textFormat: '{hh}:{mm}:{ss}',
  textShadowColor: '#000000',
  textShadowBlur: 4,
  textShadowOffsetX: 4,
  textShadowOffsetY: 4,
}

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
