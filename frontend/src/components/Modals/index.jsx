import { useSelector } from 'react-redux';
import ModalAdd from './ModalAdd';
import ModalRename from './ModalRename';
import ModalRemove from './ModalRemove';

const ModalComponent = () => {
  const { type } = useSelector((state) => state.modalsReducer);

  switch (type) {
    case 'add': {
      return <ModalAdd />;
    }
    case 'rename': {
      return <ModalRename />;
    }
    case 'remove': {
      return <ModalRemove />;
    }
    default:
      return null;
  }
};

export default ModalComponent;
