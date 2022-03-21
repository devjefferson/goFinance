import React, { useContext, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { useAuth } from '../../hooks/auth';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import {
  Container,
  Header,
  TetleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles'
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useTheme } from 'styled-components';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle, signInWithApple } = useAuth()

  const {colors} = useTheme()

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true)
      return await signInWithGoogle()
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi Possivel Conectar Na conta google")
      setIsLoading(false)
    } 
  }

  async function handleSignInWithApple() {
    try {
      return await signInWithApple()
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi Possivel Conectar Na conta Apple")
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TetleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma{'\n'}
            muito simples.
          </Title>

          <SignInTitle>
            Faça seu login com{'\n'}
            uma das contas abaixo
          </SignInTitle>
        </TetleWrapper>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            onPress={handleSignInWithGoogle}
            title='Entrar com Google'
            svg={GoogleSvg}
          />
          {
            Platform.OS == 'ios' && (
              <SignInSocialButton
                onPress={handleSignInWithApple}
                title='Entrar com Apple'
                svg={AppleSvg}
              />
            )
          }
        </FooterWrapper>
        {isLoading && <ActivityIndicator color={colors.shape} size="small" style={{marginTop: 18}} />}
      </Footer>
    </Container>
  )
}