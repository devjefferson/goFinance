import { Dimensions } from "react-native";
import { BorderlessButton, ScrollView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

import { Feather } from '@expo/vector-icons'

export const Container = styled.View`
background-color: ${({theme})=> theme.colors.background };
flex: 1;
`

export const Header = styled.View`
width: 100%;
height: ${RFValue(113)}px;

background-color: ${({theme})=> theme.colors.primary };
align-items: center;
justify-content: flex-end;

` 
export const Title = styled.Text`
color: ${({theme})=> theme.colors.shape};
font-family: ${({theme})=> theme.fonts.regular};
font-size: ${RFValue(18)}px;
`
 
export const Content = styled.ScrollView``

export const ChartContainer = styled.View`
width: 100%;
align-items: center;
justify-content: center;
`

  export const MonthSelect = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-top: 24px;
  `
  export const MonthSelectButton = styled(BorderlessButton)`
    
  `
  export const MonthSelectIcon = styled(Feather)`
   font-size: ${RFValue(24)}px;
  `
  export const Month = styled.Text`
    font-family: ${({theme})=> theme.fonts.regular};
    font-size: ${RFValue(20)}px;
  `

  
export const LoadingContainer = styled.View`
flex: 1;
justify-content: center;
align-items: center;
`
