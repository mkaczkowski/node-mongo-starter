// @flow
import * as React from 'react';
import _throttle from 'lodash/throttle';
import classnames from 'classnames';
import styles from './Header.css';
import ButtonBar from '../../components/common/buttonbar';
import type { PropertiesContextProps } from '../../providers/Properties';

type HeaderState = {
  isScrolled: boolean,
};

type HeaderProps = PropertiesContextProps;

class Header extends React.PureComponent<HeaderProps, HeaderState> {
  //$FlowIssue
  scrollY: number;
  scrollListener: any;

  state = {
    isScrolled: false,
  };

  componentDidMount() {
    this.initializeScroll();
  }

  componentWillUnmount() {
    this.endScroll();
  }

  initializeScroll = () => {
    if (!this.scrollListener) {
      this.scrollListener = _throttle(this.handleScroll, 50);
      window.addEventListener('scroll', this.scrollListener);
      this.scrollY = window.scrollY;
    }
  };

  endScroll() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  handleScroll = () => {
    this.scrollY = window.scrollY;
    const isScrolled = this.scrollY !== undefined && this.scrollY > 0;
    this.setState({ isScrolled });
  };

  render() {
    const { showAll, showRestricted } = this.props;
    const { isScrolled } = this.state;

    const className = classnames({ [styles.scrolled]: isScrolled });

    const navigationButtons = [
      { label: 'Show all', action: showAll },
      { label: 'Show in area', action: showRestricted },
    ];

    return (
      <header styleName="menu" className={className}>
        <div styleName="inner-wrapper">
          <h2>Property Explorer</h2>
          <ButtonBar buttons={navigationButtons} />
        </div>
      </header>
    );
  }
}

export default Header;
