import { Helmet } from 'react-helmet';

const MetaTags = () => {
  return (
    <Helmet>
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
    </Helmet>
  );
};

export default MetaTags;