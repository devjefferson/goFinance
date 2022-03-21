import { TouchableOpacity } from "react-native";
import styled, {css} from "styled-components/native";
import { Feather } from '@expo/vector-icons'
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton } from "react-native-gesture-handler";

interface TypeProps{
  type: "up" | "down",
}

interface ContainerProps {
  isActive: boolean,
  type: "up" | "down",
}
export const Container = styled.View<ContainerProps>`
  width: 48%;
  border: 1.5px solid ${({theme})=> theme.colors.text};
  border-radius: 5px;
  
  ${({isActive, type})=>isActive && type === "up" && css`
    background-color: ${({theme})=> theme.colors.success_light};
    border: none;
  `};

  ${({isActive, type})=>isActive && type === "down" && css`
    background-color: ${({theme})=> theme.colors.attention_light};
    border: none;
  `};

`
export const Button = styled(RectButton)`
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 16px;
`
export const Icon = styled(Feather)<TypeProps>`
color: ${({theme, type})=> type === "up" ? theme.colors.success : theme.colors.attention };
font-size: ${RFValue(24)}px;
margin-right: 12px;
`

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({theme})=> theme.fonts.regular};
`