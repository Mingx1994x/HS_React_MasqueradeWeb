import { RingLoader } from 'react-spinners';

const SectionLoading = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed',
        height: '80%',
        width: '80%',
        zIndex: 900,
        // backgroundColor: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <RingLoader
        color={'#000'}
        size={60}
        aria-label="Loading Spinner"
        data-testid="ringLoader"
      />
    </div>
  );
};

export default SectionLoading;
