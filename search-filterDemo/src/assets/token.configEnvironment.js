(function (global, factory) {
    'use strict';

    /* Use AMD */
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return new (factory(global, global.document))();
        });
    }
    /* Use CommonJS */
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = new (factory(global, global.document))();
    }
    /* Use Browser */
    else {
        global.configEnvironment = new (factory(global, global.document))();
    }
})
    (typeof window !== 'undefined' ? window : this, function (w, d) {
        var configEnvironment = function () {
            return {
                //VCFOHO_Environment: '#{HOMEOFFICE.Environment}',
                MULE_SERVICES : '#{DataPower.Deployment.Services.Internal.HTTPSDNS}:8066',
                REST_URL: '#{DataPower.Deployment.WebAPI.Internal.HTTPSDNS}:' +"#{DataPower.Deployment.WebAPI.Internal.DNS.HTTPSPort}", 
                LPLQBOAdminWeb_URI:'#{AppSettings.LPLQBOAdminWeb.Base.URI}',
                CLIENT_ID: '#{VCFO.MuleServices.ClientId}',
                CLIENT_SECRET: '#{VCFO.MuleServices.ClientSecret}',
                AuthConstants: {
                    ADMIN_USER: '#{VCFO.ADGroup.vcfoManager}',
                    NORMAL_USER: '#{VCFO.ADGroup.vcfo}',
                    ANALYST_USER: '#{VCFO.ADGroup.vcfoAnalyst}',
                    AuthUrl: '#{AppSettings.Alias.IntraWebNew}/HomeOfficeCoreRest/api/core/user',
                    Cw_Img_Url: '#{AppSettings.Alias.IntraWebNew}/HomeOfficeCoreRest/api/core/images/signinpixel'
                }
            };
        };
        return configEnvironment;
    });
