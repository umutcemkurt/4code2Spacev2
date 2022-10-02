/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // },
    // {
    //     id   : 'test',
    //     title: 'test',
    //     type : 'basic',
    //     icon : 'mat_outline:home',
    //     link : '/test'
    // },
    // {
    //     id   : 'test2',
    //     title: 'test-component',
    //     type : 'basic',
    //     icon : 'mat_outline:home',
    //     link : '/test/component-test'
    // },
    {
        id   : 'management-panel',
        title: 'Yönetim Paneli',
        type : 'group',
        icon : 'mat_outline:construction',

        children: [
            {
                id   : 'schools',
                title: 'Tüm Okullar',
                type : 'basic',
                icon : 'mat_outline:home_work',
                link : 'management-panel/schools',
                meta:'ADM-100',
                translate:'schools'
               
            }, 
            {
                id   : 'team',
                title: 'Ekip',
                type : 'basic',
                icon : 'mat_outline:groups',
                link : 'management-panel/team',
                meta:'ADM-300',
                translate:'team'
               
            }, 
            {
                id   : 'school_analysis',
                title: 'Okul Analizi',
                type : 'basic',
                icon : 'mat_outline:analytics',
                link : 'management-panel/school-analysis',
                meta:'ADM-400',
                disabled : false,
                translate:'schoolAnalysis'
               
            }, 
            {
                id   : 'chain_analysis',
                title: 'Zincir Analizi',
                type : 'basic',
                icon : 'mat_outline:analytics',
                link : 'management-panel/chain-analysis',
                meta:'ADM-500',
                translate:'chainAnalysis'
               
            }, 
    
        ],
        translate:'managementPanel'
       
    },
    {
        id   : 'MyImprove',
        title: 'Gelişimim',
        type : 'basic',
        icon : 'mat_outline:trending_up',
        link : 'my-performance',
        meta: "MYD-000"
      
        
       
    }, 
    {
        id   : 'homeworks',
        title: 'Ödevlerim',
        type : 'basic',
        icon : 'mat_outline:menu_book',
        link : 'homeworks',
        meta:'MYH-000',
        translate: 'homeworks'
        
       
    }, 
    {
        id:"classManagement",
        title: "Sınıf Yönetimi",
        type: "group",
        icon:"mat_outline:manage_accounts",
        children: [
            {
                id   : 'classes',
                title: 'Sınıflar',
                type : 'basic',
                icon : 'mat_outline:class',
                link : '/classes',
                meta : 'CLA-000',
                translate:'classes'
            },
            {
                id   : 'studentActivation',
                title: 'Öğrenci Aktivasyonu',
                type : 'basic',
                icon : 'mat_outline:group_add',
                link : '/student-activation',
                meta : 'CLA-000',
             
            },
            {
                id   : 'studentDeactivation',
                title: 'Aktivasyonu Rededilen Öğrenciler',
                type : 'basic',
                icon : 'mat_outline:person_remove',
                link : '/student-deactivation',
                meta : 'CLA-100',
             
            },
            {
                id   : 'studentActivation',
                type : 'divider',
              
                meta : 'CLA-000',
             
            },
        ]

    },
  
    {
        id   : 'homework-management',
        title: 'Ödev Yönetimi',
        type : 'basic',
        icon : 'mat_outline:app_settings_alt',
        link : '/homework-management',
        meta : 'HMT-000',
        translate:'homeworkManagement'
        
    },
    {
        id   : 'calendar',
        title: 'Takvim',
        type : 'basic',
        icon : 'mat_outline:event',
        link : '/calendar',
        translate:'calendar'
        
    },

  
  
    {
        id   : 'notifications',
        title: 'Bildirimler',
        type : 'collapsable',
        icon : 'mat_outline:notifications',
        children :[
            {
                id:'income-notification',
                title: 'Gelen Bildirimler',
                type : 'basic',
                icon: 'mat_outline:notifications_active',
                link: 'notifications/income',
                translate:'incomeNotification'
            },
            {
                id: 'sent-notification',
                title: 'Gönderilen Bildirimler',
                type: 'basic',
                icon: 'mat_outline:send',
                link: "notifications/send",
                meta :"NTF-100",
                translate:'sentNotification'
            }
        ],
        translate:'notifications'
        
    },

    {
        id   : 'support',
        title: 'Destek',
        type : 'basic',
        icon : 'mat_outline:support',
        link : '/support',
        translate:'support'
       
    },
    {
        id   : 'faq',
        title: 'Sıkça Sorulan Sorular',
        type : 'basic',
        icon : 'mat_outline:help',
        link : '/faq',
       
       
    },


];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'home',
        title: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/home'
    },
    {
        id   : 'home',
        title: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/home'
    }
];
