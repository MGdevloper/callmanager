import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import  AsyncStorage  from '@react-native-async-storage/async-storage'
const Permission = () => {

    useEffect(()=>{
       AsyncStorage.getItem("Assistant").then((d)=>{
        console.log(JSON.stringify(d));
        
       })
    },[])
  return (
    <View>
      <Text>Permission</Text>
    </View>
  )
}

export default Permission

const styles = StyleSheet.create({})