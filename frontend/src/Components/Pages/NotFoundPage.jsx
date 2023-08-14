import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation(); 
  
  return (
      <div className="h-100 bg-light">
        <div className="h-100">
          <div className="h-100" id="chat">
            <div className="d-flex flex-column h-100">
              <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                <div className="container">
                  <a className="navbar-brand" href="/">{t('title')}</a>
                </div>
              </nav>
              <div className="text-center">
                <h1 className="h4 text-muted">{t('notFoundPage')}</h1>
                <p className="text-muted">{t('redirectToMain1')} <a href="/">{t('redirectToMain2')}</a></p>
              </div>
            </div>
            <div className="Toastify"></div>
          </div>
        </div>
      </div>
    );
  };

export default NotFoundPage;
