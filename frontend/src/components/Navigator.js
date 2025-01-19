import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Navigator.scss';

class Navigator extends Component {
    render() {
        const { menus, onLinkClick } = this.props;

        return (
            <Fragment>
                <div className="navigator-menu">
                    <div className="menu-group">
                        {menus.map((group, groupIndex) => (
                            <div key={groupIndex} className="menu">
                                <Link to={group.link} className="menu-link" onClick={onLinkClick}>
                                    <FormattedMessage id={group.name} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
