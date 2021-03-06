import styled from "styled-components/native";
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

import { Feather } from '@expo/vector-icons'
import { FlatList, FlatListProps, StatusBar } from "react-native";

import { DataListProps } from '.'
import { BorderlessButton } from "react-native-gesture-handler";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`
export const Header = styled.View`
  width: 100%;
  height: ${RFPercentage(42)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: flex-start;
  align-items: center;
`
export const UserWrapper = styled.View`
  width: 100%;
  padding: 0px ${RFValue(22)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(StatusBar.currentHeight ? StatusBar.currentHeight + 28 : 28)}px;
`
export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
  `
export const Photo = styled.Image`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;
    border-radius: 10px;
  `
export const User = styled.View`
    margin-left: ${RFValue(17)}px;
  `
export const UserGreeting = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size:${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
  `
export const UserName = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size:${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.bold};
`
export const LogoutButton = styled(BorderlessButton)`

`;
export const Icon = styled(Feather)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${RFValue(21)}px;
 `
export const HighlightCards = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 24
  }
})`
  width: 100%;

  position: absolute;
  margin-top: ${RFPercentage(20)}px;
`

export const Transaction = styled.View`
  flex: 1;
  padding: 0 24px;
  margin-top: ${RFPercentage(12)}px;
`

export const Title = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-bottom: 16px;
`
export const TransactionsList = styled(
  FlatList as new (props: FlatListProps<DataListProps>) => FlatList<DataListProps>
).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingBottom: 5
  }
})`

`

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
