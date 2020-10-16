import { 
  theme 
} from '@looker/components'
import { ITheme } from '@looker/sdk/lib/sdk/4.0/models'

export function createTheme(theme_object: ITheme) {
  let colors = {...theme.colors}
  let new_theme = {...theme}
  if (theme_object.settings) {
    const { settings } = theme_object
    if (settings.background_color) { 
      colors['background'] = settings.background_color 
      colors['ui1'] = shadeColor(settings.background_color, (startsWithDark(theme_object.name) ? 25 : -5 ) )
    }
    if (settings.title_color) { 
      for (var i=1; i<=5; i++) { colors[`text${i}`] = settings.title_color }
    }
    if (settings.font_family ) { 
      new_theme['fonts']['body'] = settings.font_family;
      new_theme['fonts']['brand'] = settings.font_family;
      new_theme['fonts']['code'] = settings.font_family;
    }
    // if (settings.primary_button_color) { colors['ui1'] = settings.primary_button_color}
    return {
      ...new_theme, colors 
    }
  } else {
    if (theme_object.name === 'dark') {
      colors['background'] = '#191919'
      for (var i=1; i<=5; i++) { colors[`text${i}`] = "#8e3aae" }
      return {
        ...new_theme, colors 
      }
    } else {
      return new_theme
    }
  }
}

export function startsWithDark (name: string) {
  return (name.toLowerCase().startsWith('dark'))
}

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(color: string, percent: number) {

  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}