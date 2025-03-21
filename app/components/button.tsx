//Mettre parametre --------- title --------- (title du button) et --------- onPress --------- (pour choisir quand faire quand cliqué)
//                 --------- transparent --------- (true si button beige / false si rouge)
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";
import { useState, useRef } from "react";

interface ButtonProps {
    title: string;
    onPress?: (pressed: boolean) => void;
    transparent: boolean;
}

export default function Button({ title, onPress, transparent }: ButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current; // Animation de scale

    const handlePress = () => {
        const newState = !isPressed;
        setIsPressed(newState);
        onPress?.(newState);
    };

    const animatePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9, // Réduction de la taille
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const animatePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1, // Retour à la taille normale
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    style={({ pressed }) => [
                        transparent ? { backgroundColor: pressed ? "#fbf2c4" : "#fff9d9", shadowColor: "#25251a",
                        } :{ backgroundColor: pressed ? "#9e1d4e" : "#cd2a65", shadowColor: "#500e27" },
                            styles.button,

                    ]}
                    onPress={handlePress}
                    onPressIn={animatePressIn}
                    onPressOut={animatePressOut}
                >
                    <Text style={[styles.text, transparent ? { color: "#777777"} :{ color: "#ffffff" }]}>{title}</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    statusText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "#6b476f",
    }
});
