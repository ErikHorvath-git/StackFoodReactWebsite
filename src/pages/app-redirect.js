
export default function AppRedirect() {
    return (
        <div style={{ textAlign: "center", padding: 40 }}>
            <p>Redirecting to the app store...</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { req, query } = context;
    const { playStore, appStore } = query;

    const asRedirectTarget = (value) => {
        if (typeof value !== 'string') return null;
        const trimmed = value.trim();
        if (!trimmed || trimmed === '#') return null;
        return trimmed;
    };

    if (!playStore && !appStore) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const userAgent = req.headers['user-agent'] || '';
    let redirectLink = '/';

    if (/android/i.test(userAgent)) {
        redirectLink = asRedirectTarget(playStore) || '/';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        redirectLink = asRedirectTarget(appStore) || '/';
    }

    return {
        redirect: {
            destination: redirectLink,
            permanent: false,
        },
    };
}
