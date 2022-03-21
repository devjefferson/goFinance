import React, { useEffect, useState } from 'react'
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native'

import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'



import Button from '../../components/Form/Button'
import CategorySelectButton from '../../components/Form/CategorySelectButton'
import InputForm from '../../components/Form/InputForm'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'

import { CategorySelect } from '../CategorySelect'


import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionType
} from './styles'
import { useAuth } from '../../hooks/auth'



interface FormProps {
  name: string,
  amount: string
}

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  amount: yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser Negativo')
    .required('O Valor e Obrigatório')
})

export function Register() {
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: 'category',
    name: "Categoria"
  })

  const {user} = useAuth()
  const navigation = useNavigation() as any

  const dataKey = `@gofinances:transactions_user:${user.id}`

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  async function handleRegister({ name, amount }: FormProps) {
    if (!transactionType)
      return Alert.alert("Selecione o tipo da transação")

    if (category.key === 'category')
      return Alert.alert("Selecione a categoria")

    const newTransaction = {
      id: String(uuid.v4()),
      name,
      amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
  
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = [
        ...currentData,
        newTransaction
      ]
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

      reset()
      setTransactionType('')
      setCategory({
        key: 'category',
        name: "Categoria"
      })
      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível salvar")
    }  
  }

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>

        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name='name'
              placeholder='Nome'
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name="amount"
              placeholder='Preço'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />
            <TransactionType>
              <TransactionTypeButton
                type='up'
                title="Income"
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton type='down' title="Outcome"
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionType>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
        <Modal
          visible={categoryModalOpen}
        >
          <GestureHandlerRootView style={{ width: "100%", height: "100%" }}>
            <CategorySelect
              setCategory={setCategory}
              closeSelectCategory={handleCloseSelectCategoryModal}
              category={category}
            />
          </GestureHandlerRootView>
        </Modal>

      </Container>
    </TouchableWithoutFeedback>
  )
}
