import React, { useRef, useState, useEffect } from 'react'
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native'
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { Dimensions } from "react-native";
const {width, height} = Dimensions.get('window');

const COLORS = {
  primary : "#ff8612",

  black: "#171717",
  white: "#FFFFFF",
  background: "#FFFFFF"
}

const SIZES = {
  base: 10,
  width,
  height
}

const data = [
    {
        _id: '1',
        title: 'GoTaxi Géolocalisation',
        description: 'Choisissez votre itinéraire à partir de votre position actuelle.',
        img: require('../assets/onboard2.png')
    },
    {
        _id : '2',
        title: 'GoTaxi Communication',
        description: 'Discutez du prix avec nos chauffeurs.',
        img: require('../assets/onboard3.png')
    },
    {
        _id : '3',
        title: 'GoTaxi live traffic',
        description: 'parcourez tout le trafic en direct et profitez de nos services qui sont les meilleurs.',
        img: require('../assets/onboard.png')
    },
]

const Onboarding = ({navigation}) => {

    const flatlistRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);
    const [viewableItems, setViewableItems] = useState([])

    const handleViewableItemsChanged = useRef(({viewableItems})=> {
        setViewableItems(viewableItems)
    })
    useEffect(() => {
        if(!viewableItems[0] || currentPage === viewableItems[0].index) 
            return;
        setCurrentPage(viewableItems[0].index)

    }, [viewableItems])

    const handleNext = () => {
        if(currentPage == data.length-1)
            return;

        flatlistRef.current.scrollToIndex({
            animated: true,
            index: currentPage +1
        })
    }

    const handleBack = () => {
        if(currentPage==0) 
            return;
        flatlistRef.current.scrollToIndex({
            animated: true,
            index: currentPage - 1
        })
    }

    const handleSkipToEnd = () => {
        flatlistRef.current.scrollToIndex({
            animate: true,
            index: data.length - 1
        })
    }

    const renderTopSection = () => {
        return (
            <SafeAreaView>
                <View style={{
                    flexDirection:'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.base * 2,
                    padding: 10
                }}>
                    {/* Back button */}
                    <TouchableOpacity
                     onPress={handleBack}
                     style={{
                        padding: SIZES.base
                    }}>
                        {/* Back icon */}
                        {/* Hide back button on 1st screen */}
                        <AntDesignIcons name="left" style={{
                            fontSize: 21,
                            color: COLORS.black,
                            opacity: currentPage == 0 ? 0 : 1
                        }} />
                    </TouchableOpacity>

                    {/* Skip button */}
                    {/* Hide Skip button on last screen */}
                    <TouchableOpacity onPress={handleSkipToEnd}>
                        <Text style={{
                            fontSize: 18,
                            color: COLORS.black,
                            opacity: currentPage == data.length-1 ? 0 : 1
                        }}>Skip</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        )
    }

    const renderBottomSection = () => {
        return (
            <SafeAreaView>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal:SIZES.base *2,
                    paddingVertical: SIZES.base *2
                }}>
                    {/* Pagination */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            // No. of dots
                            [...Array(data.length)].map((_, index)=>(
                                <View
                                key={index} 
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: index==currentPage 
                                    ? COLORS.primary
                                    : COLORS.primary + '20',
                                    marginRight: 8
                                }} />
                            ))
                        }
                        

                    </View>

                    {/* Next or GetStarted button */}
                    {/* Show or Hide Next button & GetStarted button by screen */}
                    {
                        currentPage != data.length - 1 ? (
                            <TouchableOpacity 
                            onPress={handleNext}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 40,
                                borderRadius: 10,
                                backgroundColor: COLORS.primary,
                                shadowColor: "#000",
                                shadowOffset: {
                                  width: 0,
                                  height: 6,
                                },
                                shadowOpacity: 0.39,
                                shadowRadius: 8.30,

                                elevation: 13,
                            }}
                            activeOpacity={0.8}
                            >
                                <Text style={{
                                    color: COLORS.white,
                                    fontSize: 15
                                    }}>Suivant</Text>
                            </TouchableOpacity>
                        ) : (
                            // Get Started Button
                            <TouchableOpacity 
                            onPress={() => navigation.navigate('Auth')}
                            style={{
                                paddingHorizontal: SIZES.base,
                                height: 47,
                                borderRadius: 10,
                                backgroundColor: COLORS.primary,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    color: COLORS.white,
                                    fontSize: 16,
                                    marginLeft: SIZES.base
                                }}>Commencer</Text>
                                <AntDesignIcons name="right" 
                                style={{fontSize: 18, color: COLORS.white, opacity: 0.3, marginLeft: SIZES.base}}/>
                                <AntDesignIcons
                                name="right"
                                style={{fontSize: 25, color: COLORS.white, marginLeft: -15}}
                                />
                            </TouchableOpacity>
                        )
                    }
                    
                </View>
            </SafeAreaView>
        )
    }

    const renderFlatlistItem = ({item}) => {
        return (
            <View style={{
                width: SIZES.width,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    alignItems: 'center',
                }}>
                    <Image
                    source={item.img}
                    style={{
                      width: width / 1.2, 
                      height: height / 2, 
                      borderRadius: 30,
                  }}
                    />
                </View>
                <View style={{paddingHorizontal: SIZES.base * 4, marginVertical: SIZES.base * 3}}>
                    <Text style={{fontSize: 22, textAlign: 'center', fontWeight: 'bold', color: COLORS.primary}}>
                        {item.title}
                    </Text>
                    <Text style={{
                        fontSize: 17.5,
                        textAlign: 'center',
                        marginTop: 10,
                        lineHeight: 28,
                        color: COLORS.black
                    }}>
                        {item.description}
                    </Text>
                </View>

            </View>
        )
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#fff'
        }}>
          <View
              style={{width: width, height: height + 5, borderRadius: 37, resizeMode: 'contain'}}>
                  <StatusBar barStyle="dark-content" backgroundColor="transparent"/>

                  {/* TOP SECTION - Back & Skip button */}
                  { renderTopSection() }

                  {/* FLATLIST with pages */}
                  <FlatList
                  data={data}
                  pagingEnabled
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item._id}
                  renderItem={renderFlatlistItem}

                  ref={flatlistRef}
                  onViewableItemsChanged={handleViewableItemsChanged.current}
                  viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
                  initialNumToRender={1}
                  extraData={SIZES.width}
                  />

                  {/* BOTTOM SECTION - pagination & next or GetStarted button */}
                  { renderBottomSection() }

          </View>

        </View>
    )
}

export default Onboarding