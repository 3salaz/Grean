import { Spin } from 'antd';
import PropTypes from 'prop-types';

const Loader = ({ fullscreen }) => {
  return (
    <div
      className={`flex justify-center items-center bg-white bg-opacity-80 ${
        fullscreen ? 'fixed z-50 top-0 left-0 w-full h-full' : 'absolute z-10 top-0 left-0 w-full h-full'
      }`}
    >
      <Spin size="large" />
    </div>
  );
};

Loader.propTypes = {
  fullscreen: PropTypes.bool,
};

Loader.defaultProps = {
  fullscreen: false,
};

export default Loader;
