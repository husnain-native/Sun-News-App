import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";

const LiveBadge = () => {
  const signal1 = useRef(new Animated.Value(0)).current;
  const signal2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSignal = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateSignal(signal1);
    setTimeout(() => animateSignal(signal2), 200);
  }, []);

  return (
    <View style={styles.container}>
      {/* Signal Animation on Left */}
      <View style={styles.signalContainer}>
        <View style={styles.signalDot} />
        <Animated.View style={[styles.signalWave, { opacity: signal1, transform: [{ scale: signal1 }] }]} />
        <Animated.View style={[styles.signalWave, { opacity: signal2, transform: [{ scale: signal2 }] }]} />
      </View>

      {/* Live Text Box */}
      <View style={styles.liveBox}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  liveBox: {
    backgroundColor: "#E60000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  liveText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  signalContainer: {
    marginRight: 1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  signalWave: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#E60000",
  },
  signalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E60000",
    position: "absolute",
  },
});

export default LiveBadge;
