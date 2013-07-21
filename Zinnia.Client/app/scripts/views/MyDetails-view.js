/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'settings/utility',
    'models/MyDetails-model'
], function ($, _, Backbone, JST, Utility, MyDetailsModel) {
    'use strict';
    var self;
    var modelJson;
    var MyDetailsView = Backbone.View.extend({
        model : new MyDetailsModel(),
        isFormValidated : false,
        initialize: function () {
            self = this;
            this.model.on('change',this.render,this);
            this.model.fetch({
                success: self.displayUserDetails,
                error: Utility.handleServerError
            });
        },
        el: $('#contentPane'),
        template: JST[('app/scripts/templates/MyDetails.ejs')],
        events: {
            'click #saveUserDetails': 'validateAndSaveUserDetails'
        },
        render: function () {
            console.log(self.model.toJSON());
            self.$el.html(self.template(self.model.toJSON()));
        },
        displayUserDetails:function(){
            self.render();
            modelJson = self.model.toJSON();
            //var objDOB = new Date(modelJson.DOB);
            var objDOB = modelJson.DOB.split('T')[0].split('-');
            $('#ddlDate').val(objDOB[2]);
            $('#ddlMonth').val(objDOB[1]);
            $('#ddlYear').val(objDOB[0]);
            $('#ddlGender').val(modelJson.Gender);
            self.GetSetCountries();
        },
        GetSetCountries:function(){
            Backbone.ajax({
                dataType: 'json',
                url: Utility.hostUrl + '/webapi-profiles/Api/Profile/V1/Traveler/GetCountries',
                data: '',
                success: function(val){
                    console.log(val);
                    //ddlCountryList = val;
                }
            });
        },
        saveUserDetails:function(){
            self.model.save({
                Title : this.$el.find('#ddlTitle').val(),
                Gender : this.$el.find('#ddlGender').val(),
                FirstName : this.$el.find('#txtFirstName').val(),
                LastName : this.$el.find('#txtLastName').val(),
                UserInfo : {
                    Id:'bff87e59-1df1-47fa-a362-436cf8173646',
                    Email : this.$el.find('#txtEmail').val(),
                    Password : this.$el.find('#txtPass').val(),
                    IsActive : true
                },
                AddressInfo :{
                    City:this.$el.find('#txtCity').val(),
                    Mobile:this.$el.find('#txtMobileNumber').val(),
                    Street1:this.$el.find('#txtAddressOne').val(),
                    Street2:this.$el.find('#txtAddressTwo').val(),
                    State:'NY',
                    Country:'US',
                    Zip:this.$el.find('#txtZipCode').val(),
                    Landline:this.$el.find('#txtContactNumber').val()
                },
                DOB:'06/06/1980',
                TsaNumber: this.$el.find('#txtTsaNumber').val(),
                userRememberMe: false,
                LoginFailed: false,
                LoginAccepted: false,
                ddlGenderList : {},
                ddlTitleList : {},
                ddlDateList : {},
                ddlMonthList : {},
                ddlYearList : {},
                ddlTitleCategoryList: {}
            });
            location.hash = 'my-account/my-details';
        },
        validateAndSaveUserDetails:function(){
            //self.saveUserDetails();
            //idOrClass, TextToDisplay,Case,RegexIfToUse,Range,emptyError|RegexError|RamgeErrorMin|RangeErrorMax,ifFocusAllowed
            var isValidEmail = Utility.validateInput('#txtEmail', 'Email1', '', Utility.regexEmail, '', 'Email cannot be blank, please fill|||',true);
            var isValidPass =true;// = Utility.validateInput('#txtPass', 'Password', '', Utility.regexPassword, '', '', true);
            var isValidFirstName = Utility.validateInput('#txtFirstName', 'First name', '', Utility.regexNoSpace, '', '', true);
            var isValidLastName = Utility.validateInput('#txtLastName', 'Last name', '', Utility.regexNoSpace, '', '', true);
            var isValidCity = Utility.validateInput('#txtCity', 'city name', '', '', '', '', true);
            var isValidAddressOne = Utility.validateInput('#txtAddressOne', 'Address field', '', '', '', '', true);
            //var isValidEmail = Utility.validateInput('#txtMobileNumber', 'Mobile number', '', Utility.regexOnlyNumbers, '10-20', '', true);
            //var isValidEmail = Utility.validateInput('#txtContactNumber', 'Contact number', '', Utility.regexOnlyNumbers, '', '', true);
            //var isValidEmail = Utility.validateInput('#txtZipCode', 'Zip code', '', Utility.regexOnlyNumbers, '', '', true);
            //this.checkPassword();
            if(isValidEmail && isValidPass && isValidFirstName && isValidLastName && isValidCity && isValidAddressOne)
            {
                self.saveUserDetails();
            }
        }
    });
    return MyDetailsView;
});