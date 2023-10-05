import styles from './LoadingSpinner.module.scss';

type LoadingSpinnerProps = {
    color?: 'white' | 'black';
    centered?: boolean;
};

function LoadingSpinner({ color = 'white', centered = false }: LoadingSpinnerProps) {
    return (
        <div
            className={`${styles.ldsRoller} ${styles[color]} ${
                centered ? styles.centered : null
            }`}
        >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default LoadingSpinner;
