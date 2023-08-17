import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MiniApi from '@momo-miniapp/api';
import { Spacing, Colors, Text } from '@momo-kits/core';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Spacing.XL
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingLogo: {
        width: 60,
        height: 60,
        marginTop: Spacing.S,
        marginBottom: Spacing.M
    },
    welcome: {
        textAlign: 'center'
    },
    versionView: {
        marginBottom: Spacing.XL
    },
    version: {
        textAlign: 'center'
    },
    guideView: {
        margin: Spacing.M
    },
    guideItemView: {
        marginTop: Spacing.L
    },
    guideDetail: {
        marginTop: Spacing.S
    },
    link: {
        color: Colors.link
    },
    tableDocuments: {
        marginVertical: Spacing.M
    },
    rowBewteen: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    documentSection: {
        flex: 0.35
    },
    documentDetail: {
        flex: 0.65
    },
    documentItem: {
        marginVertical: Spacing.S
    },
    line: {
        backgroundColor: Colors.border_color_gray,
        height: 1,
        marginVertical: Spacing.S
    }
})

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.center}>
                        <Text.H3 style={styles.welcome} weight="bold">Welcome to MoMo Mini App</Text.H3>
                    </View>
                    <View style={styles.guideView}>
                        <View style={styles.guideItemView}>
                            <Text.H4 weight="bold">Step One</Text.H4>
                            <Text style={styles.guideDetail}>Download <Text weight="bold">app.json</Text> from <Text weight="bold">Mini App Center</Text> and replace current file in project</Text>
                        </View>
                        <View style={styles.guideItemView}>
                            <Text.H4 weight="bold">Step Two</Text.H4>
                            <Text style={styles.guideDetail}>Terminate current Metro server and run command <Text weight="bold">momo-miniapp start</Text> to apply configs</Text>
                        </View>
                        <View style={styles.guideItemView}>
                            <Text.H4 weight="bold">Start Development</Text.H4>
                            <Text style={styles.guideDetail}>See <Text
                                style={styles.link}
                                onPress={() => {
                                    MiniApi.copyToClipboard('https://developers.momo.vn/v3/docs/app-center/development-guideline/development/create-mini-app', 'copied')
                                }}
                                weight="bold">
                                Development Guide
                            </Text> to make awesome Mini App
                            </Text>
                        </View>
                        <View style={styles.guideItemView}>
                            <Text.H4 weight="bold">Learn More</Text.H4>
                            <Text>Read the docs to discover what to do next</Text>
                        </View>
                        <View style={styles.tableDocuments}>
                            <View style={styles.line} />
                            <View style={[styles.rowBewteen, styles.documentItem]}>
                                <Text
                                    onPress={() => {
                                        MiniApi.copyToClipboard('https://momo-kits.web.app/?path=/docs/getting-started-overview--page', 'Copied ')
                                    }}
                                    style={[styles.link, styles.documentSection]}>
                                    Component-Kits
                                </Text>
                                <Text style={styles.documentDetail}>
                                    Built-in components: Text, Button, Input, Colors, Spacing ...
                                </Text>
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.rowBewteen, styles.documentItem]}>
                                <Text
                                    onPress={() => {
                                        MiniApi.copyToClipboard('https://developers.momo.vn/v3/docs/app-center/open-capabilities/open-capabilities-introduction', 'Copied')
                                    }}
                                    style={[styles.link, styles.documentSection]}>
                                    Toolkits
                                </Text>
                                <Text style={styles.documentDetail}>
                                    Built-in functions: Add Favorite, User Data, Sharing, ...
                                </Text>
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.rowBewteen, styles.documentItem]}>
                                <Text
                                    onPress={() => {
                                        MiniApi.copyToClipboard('https://developers.momo.vn/v3/docs/app-center/development-guideline/extras/mini-api', 'Copied')
                                    }}
                                    style={[styles.link, styles.documentSection]}>
                                    Mini App API
                                </Text>
                                <Text style={styles.documentDetail}>
                                    Built-in APIs: requestUserConsents, requestPermission, getLocation ...
                                </Text>
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.rowBewteen, styles.documentItem]}>
                                <Text
                                    onPress={() => {
                                        MiniApi.copyToClipboard('https://developers.momo.vn/v3/docs/payment/guides/home', 'Copied')
                                    }}
                                    style={[styles.link, styles.documentSection]}>
                                    Payment SDK
                                </Text>
                                <Text style={styles.documentDetail}>
                                    Payment instruction
                                </Text>
                            </View>
                            <View style={styles.line} />
                        </View>

                    </View>

                </ScrollView>
                <View style={styles.versionView}>
                    <Text.SubTitle style={styles.version}>Version v3.1 power by <Text.SubTitle weight="bold">MoMo Platform</Text.SubTitle></Text.SubTitle>
                </View>
            </View>
        );
    }
}
