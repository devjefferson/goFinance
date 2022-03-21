import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState, useCallback } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'
import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transaction,
  Title,
  TransactionsList,
  LogoutButton,
  LoadingContainer
} from './styles'
import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/auth'

export interface DataListProps extends TransactionCardProps {
  id: string
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;

}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)
  const { signOut, user } = useAuth()
  const dataKey = `@gofinances:transactions_user:${user.id}`

  const theme = useTheme()

  
  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {

    const collerctionFilttered = collection
    .filter(transaction=> transaction.type === type) 

    if(collerctionFilttered.length === 0){
      return 0
    }

    const lastTransaction = new Date(Math.max.apply(Math, collerctionFilttered
      .filter((transaction) => transaction.type === type).
      map((transaction) => new Date(transaction.date).getTime())
    ))
    /*Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(new Date(lastTransaction));*/

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString("pt-BR", {
      month: 'long'
    })}`

  }

  async function loadTransactions() {
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0;
    let expenseveTotal = 0;


    const transactionsFormated: DataListProps[] = transactions.map((item: DataListProps) => {
      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })



      if (item.type === 'positive') {
        entriesTotal += Number(item.amount)
      } else {
        expenseveTotal += Number(item.amount)
      }



      const dateFormatted = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        date: dateFormatted,
        type: item.type,
        category: item.category
      }
    })

    setData(transactionsFormated)



    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative')
    
    const totalInterval = lastTransactionExpensives === 0 
    ? "Não há transações" 
    : `01 à ${lastTransactionExpensives}`

    let total = entriesTotal - expenseveTotal

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0 
        ? "Não há transações" 
        : `Última entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expenseveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0 
        ? "Não há transações" 
        : `Última saida dia ${lastTransactionExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });

    setIsLoading(false)
  }


  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []))


  return (
    <Container>
      {isLoading ? <LoadingContainer>
        <ActivityIndicator
          color={theme.colors.primary}
          size='large'
 
        />
      </LoadingContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>
                    Olá,
                  </UserGreeting>
                  <UserName>
                    {user.name}
                  </UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power"  />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <HighlightCard
              type='up'
              title="Entrada"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              title="Saidas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
            />

          </HighlightCards>

          <Transaction>
            <Title> Listagem </Title>
            <TransactionsList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <TransactionCard data={item} />}
            />
          </Transaction>
        </>}
    </Container>
  )
}