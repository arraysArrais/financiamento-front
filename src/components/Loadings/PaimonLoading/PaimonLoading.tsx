import { useLottie } from "lottie-react";
import paimon from './paimon.json'

export const PaimonLoading = () => {
    const style = {
        height: 300
    }
    const options = {
        animationData: paimon,
        loop: true,
    };

    const { View } = useLottie(options, style);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 200
        }}>
            {View}
        </div>
    )
}